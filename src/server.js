import express from 'express'; 
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'; 

const app = express();
app.use(cors()); 
const port = 3000;

// Conexión a MongoDB
mongoose.connect('mongodb+srv://hazielortiz04:022124Haziel@cluster0.ewjuf1n.mongodb.net/productDb?retryWrites=true&w=majority');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

// Definir el esquema del modelo para los pedidos
const pedidoSchema = new mongoose.Schema({
  nombreCliente: String,
  producto: String,
  cantidad: String
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Endpoint para crear un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
    try {
        const nuevoPedido = new Pedido(req.body);
        const pedidoGuardado = await nuevoPedido.save();
        res.json(pedidoGuardado);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint para obtener todos los pedidos
app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find({});
        res.json(pedidos);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint para eliminar un pedido por ID
app.delete('/api/pedidos/:id', async (req, res) => {
    try {
        const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pedido eliminado correctamente', pedido: pedidoEliminado });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
