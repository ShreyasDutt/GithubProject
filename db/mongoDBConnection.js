import mongoose from 'mongoose'


const DBconnect = async () =>{
await mongoose.connect(`${process.env.MONGODB_URI}`).then(()=>{
    console.log("DB Connected!")
}).catch((err)=>{
    console.log(err.message);
})
}

export default DBconnect;