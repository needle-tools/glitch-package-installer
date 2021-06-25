google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawDualY);

function fetchAndDraw() {
	fetch("https://package-installer.glitch.me//public/stats/098f6bcd4621d373cade4e832627b4f6")
  .then(data => data.json())
  .then(data => {
    drawDualY(data.downloads);
  });
}

fetchAndDraw();

function drawDualY(jsonData) {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Package');
      data.addColumn('number', 'Downloads');
      

			var arr = new Array();
      let i = 0;
      for(let key in jsonData) {
      	arr.push([key, jsonData[key].downloads]);
      }

			console.log(arr);
      
      data.addRows(arr);

      var options = {
        chart: {
          title: 'Package Downloads via Installer',
          subtitle: 'via https://package-installer.glitch.me/'
        },
        series: {
          0: {axis: 'MotivationLevel'},
        },
        axes: {
          y: {
            MotivationLevel: {label: 'Downloads'},
          }
        },
      };

      var materialChart = new google.charts.Bar(document.getElementById('chart_div'));
      materialChart.draw(data, options);
    }