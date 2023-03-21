//QUESTA è PRATICAMENTE UNA COPIA DELLE FUNZIONI DI INDEX.JS MA PER IL MOBILE
//PER VEDERE I COMMENTI DI QUELLE FUNZIONI GUARDA IL FILE INDEX.JS NELLA CARTELLA DESKTOP


var io = io(window.location.origin);
var isPaused = false;

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
        position: 'right', // `axis` is determined by the position as `'y'`
      }
    }  
  }
});

function addData(label, data) {
  if(myChart.data.labels.length > 50){
      removeData(myChart);
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

io.on("ping", (data) => {
  var v = new Date();
  addData(v.getHours() +":"+ v.getMinutes() + ":" + v.getSeconds(), data.val.toFixed(4));
});


io.emit("mobile");