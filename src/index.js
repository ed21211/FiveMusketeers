// Code taken from https://blog.logrocket.com/ci-cd-node-js-github-actions/
const app =  require( "./app");
const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log('Example app listening on port 3000!'),
);
