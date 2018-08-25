const gulp = require('gulp');
const generateGraphqlTypes = require('./generate-graphql-types');

gulp.task('graphql', callback => {
  generateGraphqlTypes('src', callback);
});

gulp.task(
  'watch-graphql',
  gulp.series('graphql', () => {
    gulp.watch('src/**/*.ts').on('change', gulp.series('graphql'));
  })
);

gulp.task('default', gulp.series('watch-graphql'));
