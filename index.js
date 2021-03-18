const express = require('express');
const router = require('./routes/routes');

const app = express();
const port = process.env.PORT || 7388;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
