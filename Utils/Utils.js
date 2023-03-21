/*
  QUESTO FILE E' UNA LIBRERIA DI FUNZIONI UTILI PER UN SITO GENERICO

  TUTTAVIA CONTIENE FUNZIONI NON RILEVANTI PER QUESTO PROGETTO CHE IO USO PER ALTRI PROGETTI

  SE VUOI PUOI USARLO PER IL TUO PROGETTO, MA NON E' NECESSARIO PER QUESTO.

*/


const data = require(`../package.json`);
class Utils {
  constructor(res) {
    this.res = res;
  }

  /**
   * Ottieni le informazioni del progetto presente nel package.json
 * 
 * @returns {Object} Le informazioni del progetto (nome, versione, descrizione)
 */

  projectInfo() {
    return {
      name: data.name,
      version: data.version,
      description: data.description ? data.description : "No description provided",
    };
  }

  uppercaseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
 * Ti permette di generare un ID lungo 9 caratteri
 * 
 * @returns {String} ID
 */
  generateID() {
    return Math.random().toString(36).substr(2, 9);
  }

/**
 * Ti permette di generare un ID lungo 27 caratteri
 * 
 * @returns {String} ID
 */
 
  generateLongID() {
    return (
      Math.random().toString(36).substr(2, 9) +
      Math.random().toString(36).substr(2, 9) +
      Math.random().toString(36).substr(2, 9)
    );
  }

  /**
   * Ti permette di isolare i dati da un oggetto
   * 
   * @param {Object} obj - L'oggetto da cui prendere i dati
   * 
   * @param {String} props - Le proprietà da prendere
   * 
   * @returns {Object} L'oggetto con i dati richiesti
   * 
   * @example
   * utils.getDataFromObj({name: "Mario", cognome: "Rossi", age: 15}, "name", "age")
   * 
   * // Risultato: {name: "Mario", age: 15}
   * 
   */

  getDataFromObj(obj, ...props) {
    if (!obj) return null;
    if (typeof obj !== "object") return null;
    if (props.length === 0) return {};
    let obj1 = {};
    for (let i = 0; i < props.length; i++) {
      if(props[i].includes(".")) {
        let props2 = props[i].split(".");
        obj1[props2[0]] = this.getDataFromObj(obj[props2[0]], props2[1]);
      } else {
        obj1[props[i]] = obj[props[i]];
      }
    }
    return obj1;
  }


  /**
   * Ti permette di creare un errore da inserire in una route
   * 
   * @param {Object} data
   * @returns {Object} response
   * @example
   * utils.error({code: 400, message: "NO BRO NO"})
   */

  error(data) {
    if(!this.res) throw new Error("No response provided");
    if(typeof data !== "object") throw new Error("Data must be an object");
    let obj = { code: data.code ? data.code : 400, message: data.message ? data.message : "Bad request"};
    for(let key in data) {
      if(key !== "code" && key !== "message") obj[key] = data[key];
    }

    return this.res.status(obj.code).json(obj);
  }

  /**
    Ottieni un file di configurazione
    @param {String} filename - Il nome del file di configurazione senza estensione
     ```js
    var config = getConfig("websiteconfig");
    ```
    Ricorda di non mettere l'estensione del file
    @author EatingSouls
    */
    getConfig (filename) {
        return JSON.parse(require("fs").readFileSync(`./configurations/${filename}.json`));
    }


    /**
     * Modifica un file di configurazione
    */

    modifyConfig(filename, data) {
        if(typeof data !== "object") throw new Error("Data must be an object");
        let config = this.getConfig(filename);
        for(let key in data) {
            config[key] = data[key];
        }
        require("fs").writeFileSync(`./configurations/${filename}.json`, JSON.stringify(config, null, 4));
        return config;
    }


    /**
     * Ottieni un errore con la traccia dello stack
     * 
     * @param {String} mex - Messaggio dell'errore
     * @param {Function} func - Funzione da cui prendere la traccia dello stack
     * @returns {Error} Errore
     * @example
     * utils.captureStackTrace("NO BRO NO", utils.captureStackTrace)
     *  */

    captureStackTrace(mex, func) {
      if (typeof mex !== "string") mex = "Error";
      if (typeof func !== "function") func = this.captureStackTrace;

      const err = new Error(mex);
      Error.captureStackTrace(err, func);
      return err;
    }
}

/**
 * @param {String} color - Colore del testo
 * @param {String} text - Testo da colorare
 * @returns {String} Testo colorato
 * @example
 * console.log(colors("red", "Ciao"));
 * @example
 * console.log(colors("green", "Ciao"));
 * @example
 * console.log(colors("yellow", "Ciao"));
*/

function colors(color, text) {
    var colors = {
        "red": "\x1b[31m",
        "green": "\x1b[32m",
        "yellow": "\x1b[33m",
        "blue": "\x1b[34m",
        "magenta": "\x1b[35m",
        "cyan": "\x1b[36m",
        "white": "\x1b[37m",
        "reset": "\x1b[0m"
    }
    return colors[color] + text + colors["reset"];
}
global.colors = colors;


module.exports = Utils;
