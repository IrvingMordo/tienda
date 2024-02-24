import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


const app = express();
const PORT = process.env.PORT || 3300;

mongoose.connect('mongodb+srv://hazielortiz04:022124Haziel@cluster0.ewjuf1n.mongodb.net/productDb?retryWrites=true&w=majority');
mongoose.connection.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
mongoose.connection.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

const { Schema } = mongoose;

const pedidoSchema = new Schema({
  producto: {
    type: String,
    required: [true, 'El campo producto es obligatorio'],
    trim: true, // Elimina espacios en blanco al principio y al final del valor
  },
  cantidad: {
    type: Number,
    required: [true, 'El campo cantidad es obligatorio'],
    min: [1, 'La cantidad debe ser al menos 1'],
  },
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
app.use(bodyParser.json());

app.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
});

app.put('/pedidos', async (req, res) => {
  try {
    const nuevoPedido = new Pedido(req.body);
    await nuevoPedido.save();
    res.status(201).json({ mensaje: 'Pedido realizado con éxito.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al realizar el pedido.' });
  }
});

app.delete('/pedidos/:id', async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Pedido eliminado con éxito.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el pedido.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
