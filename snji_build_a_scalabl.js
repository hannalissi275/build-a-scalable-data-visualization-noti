class DataModel {
  constructor() {
    this.data = []; // store data points
    this.thresholds = {
      warning: 80,
      critical: 90
    }; // customizable thresholds for notifications
    this.notifications = []; // store notification events
  }

  addDataPoint(point) {
    this.data.push(point);
    this.checkThresholds();
  }

  checkThresholds() {
    const lastPoint = this.data[this.data.length - 1];
    if (lastPoint.value > this.thresholds.warning) {
      this.sendNotification('warning', lastPoint);
    } else if (lastPoint.value > this.thresholds.critical) {
      this.sendNotification('critical', lastPoint);
    }
  }

  sendNotification(type, point) {
    const notification = {
      type,
      message: `Alert: ${type} threshold exceeded at ${point.time}`,
      data: point
    };
    this.notifications.push(notification);
    // trigger visualization update
    visualizeData(this.data, this.notifications);
  }
}

class Visualizer {
  constructor(element) {
    this.element = element;
    this.chart = new Chart(element, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Data Points',
          data: []
        }]
      }
    });
  }

  updateChart(data, notifications) {
    const labels = data.map(point => point.time);
    const values = data.map(point => point.value);
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = values;
    this.chart.update();

    // highlight notifications
    notifications.forEach(notification => {
      const index = labels.indexOf(notification.data.time);
      this.chart.data.datasets[0].data[index] = {
        x: notification.data.time,
        y: notification.data.value,
        borderWidth: 3,
        borderColor: notification.type === 'warning' ? 'orange' : 'red'
      };
    });
  }
}

function visualizeData(data, notifications) {
  const element = document.getElementById('chart');
  const visualizer = new Visualizer(element);
  visualizer.updateChart(data, notifications);
}

const dataModel = new DataModel();

// sample data
dataModel.addDataPoint({ time: 1, value: 70 });
dataModel.addDataPoint({ time: 2, value: 85 });
dataModel.addDataPoint({ time: 3, value: 92 });
dataModel.addDataPoint({ time: 4, value: 80 });
dataModel.addDataPoint({ time: 5, value: 95 });