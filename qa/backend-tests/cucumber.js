module.exports = {
  default: {
    requireModule: [],
    require: ['features/support/**/*.js', 'features/step_definitions/**/*.js'],
    format: ['progress-bar', 'html:../reports/backend-report.html'],
    publishQuiet: true,
    paths: ['features/**/*.feature']
  }
};
