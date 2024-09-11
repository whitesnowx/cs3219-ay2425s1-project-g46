const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000 

app.use(cors()); 
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});
app.post('/submit', (req, res) => {
  const { inputText } = req.body; 
  console.log('Received input:', inputText);
  res.status(200).json({ message: `Form data received successfully: ${inputText}` });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})