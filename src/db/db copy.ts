import mongoose from 'mongoose';

export const connectDB =async  ()=>{
    try {
        const urlConnect = `${process.env.MONGO_URI}${process.env.DB}`
        await mongoose.connect(urlConnect!)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}