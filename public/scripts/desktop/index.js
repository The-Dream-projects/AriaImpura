//FUNZIONE PER IL TESTO CHE SI SCRIVE A SCHERMO
function typeEffect(element, speed) {
    let text = element.innerHTML;
    element.innerHTML = "";
  
    let i = 0;
    let timer = setInterval(function () {
      if (i < text.length) {
        element.append(text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }
  
  // application
  let speed = 140;
  let h1 = document.querySelector('h2');
  let delay = h1.innerHTML.length * speed + speed;
  
  // type affect to header
  
  typeEffect(h1, speed);
  
  document.getElementById('ActiveSlider1').style.display = 'block';
  

  //FUNZIONE PER IL CAMBIO DI CIO' CHE SI VEDE A SCHERMO
  function slide(id) {
    let clicked = id.getAttribute('id');
  
    if (clicked == 'slider1') {
      disableClass('ActiveSlider', "Slide");
      document.getElementById('Slide1').style.display = 'block';
      document.getElementById('ActiveSlider1').style.display = 'block';
    }
    if (clicked == 'slider2') {
      disableClass('ActiveSlider', "Slide");
      document.getElementById('Slide2').style.display = 'block';
      document.getElementById('ActiveSlider2').style.display = 'block';
    }
    if (clicked == 'slider3') {
      disableClass('ActiveSlider', "Slide");
      document.getElementById('Slide3').style.display = 'block';
      document.getElementById('ActiveSlider3').style.display = 'block';
    }
    if (clicked == 'slider4') {
      disableClass('ActiveSlider', "Slide");
      document.getElementById('Slide4').style.display = 'block';
      document.getElementById('ActiveSlider4').style.display = 'block';
      
    }
  }

  var scrollpause = false; //UTILIZZATO NEI TEST


  //FUNZIONE PER IL CAMBIO automatico DI CIO' CHE SI VEDE A SCHERMO
  setInterval(() => {
    
    if(scrollpause == true) { return; }

    var currentActive = document.querySelector('.ActiveSlider[style="display: block;"]').getAttribute('id');
    switch (currentActive) {
        case 'ActiveSlider1':
            document.getElementById('slider2').click();
            break;
        case 'ActiveSlider2':
            document.getElementById('slider3').click();
            break;
        case 'ActiveSlider3':
            document.getElementById('slider4').click();
            break;
        case 'ActiveSlider4':
            document.getElementById('slider1').click();
            typeEffect(h1, speed);
            break;
    }
  }, 10000);

  //FUNZIONE NECESSARIA A TOGLIERE IL DISPLAY DA TUTTI GLI ELEMENTI CHE HANNO LE CLASSI PASSATE COME PARAMETRO
  function disableClass(...id) {
    id.forEach(element => {
      var classes = document.querySelectorAll("." + element);
      classes.forEach(element1 => {
        element1.style.display = 'none';
      });
    });
  }


  //FUNZIONE PER IL CAMBIO DI CIO' CHE SI VEDE A SCHERMO CON LO SCROLL DEL MOUSE ATTENZIONE CHE POTREBBE ANCORA MOSTRARE QUALCHE BUG
var scrolling = false;
  document.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (scrolling) {
        return;
    }
    if (e.deltaY > 0 && !scrolling) {
        scrolling = true;
        var currentActive = document.querySelector('.ActiveSlider[style="display: block;"]').getAttribute('id');
        switch (currentActive) {
            case 'ActiveSlider1':
                document.getElementById('slider2').click();
                break;
            case 'ActiveSlider2':
                document.getElementById('slider3').click();
                break;
            case 'ActiveSlider3':
                document.getElementById('slider4').click();
                break;
            case 'ActiveSlider4':
                document.getElementById('slider1').click();
                break;
    }
    } else {
        scrolling = true;
        var currentActive = document.querySelector('.ActiveSlider[style="display: block;"]').getAttribute('id');
        switch (currentActive) {
            case 'ActiveSlider1':
                document.getElementById('slider4').click();
                break;
            case 'ActiveSlider2':
                document.getElementById('slider1').click();
                break;
            case 'ActiveSlider3':
                document.getElementById('slider2').click();
                break;
            case 'ActiveSlider4':
                document.getElementById('slider3').click();
                break;
        }
    }

    setTimeout(() => {
        scrolling = false;
    }, 1000);
  });
  
  var io = io(window.location.origin); //CONNESSIONE AI SOCKET DEL SERVER BACKEND
  
  io.on("ping", (data) => { //ASPETTA UN MESSAGGIO PING DAL SERVER CON I DATI DI RILEVAZIONE DEL PHOTON
      var v = new Date();
    if(data != undefined){
      addData(v.getHours() +":"+ v.getMinutes() + ":" + v.getSeconds(), data.val.toFixed(4));
    }
      
  });


  //FUNZIONE DELLA LIBRERIA CHART.JS PER IL GRAFICO TI CHIEDO DI MODIFICARE IL MENO POSSIBILE QUI PER EVITARE PROBLEMI
  let ctx = document.querySelector('#line');
  
  //Line Chart
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Purezza aria',
        data: [],
        borderColor: '#3375F6',
        pointBorderColor: "#FFFFFF",
        borderWidth: 2,
      }],
    },
    options: {
      reponsive: false,
      animation: false,
      scales: {
        y: {
          grid: {
            color: "#515962",
            beginAtZero: true
          }
        },
        x: {
          grid: {
            color: "#515962",
          }
        },
        myScale: {
          type: 'logarithmic',
          position: 'right',
        }
      }  
    }
  });
  

  //FUNZIONI PER AGGIUNGERE E RIMUOVERE DATI DAL GRAFICO
  function addData(label, data) {
    if(myChart.data.labels.length > 50){
        removeData(myChart); //LA RIMOZIONE DEI DATI E' NECESSARIA PER EVITARE CHE IL GRAFICO SI INTASI DI DATI RENDENDO IL TUTTO INCOMPREENSIBILE
    }
    myChart.data.labels.push(label);
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    myChart.update();
  }
  

  function removeData(chart) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
  }

  io.on("changecount", (data) => { //ASPETTA UN MESSAGGIO CHANGECOUNT DAL SERVER CON I DATI DI CONTEGGIO DELLE PERSONE CONNESSE IN REALTIME
    document.getElementById("counter").innerHTML = data;
  });