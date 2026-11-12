import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

        if (!uri) {
            throw new Error('Define MONGODB_URI o MONGO_URI');
        }

        await mongoose.connect(uri);

        console.log('MongoDB conectado correctamente');
        console.log('Base de datos:', mongoose.connection.name);

    } catch (error) {
        console.error('Error al conectar MongoDB:', error.message);
        process.exit(1);
    }
};

export default conectarDB;
