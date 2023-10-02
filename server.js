const app =require('./app.js')

const dbconnect =require("./database/database")
const cloudinary =require('cloudinary')

//handling uncaught exception
process.on('uncaughtException',(err)=>{
    console.log(` error : ${err.message}`)
    console.log(` shutting down the server due to uncaught exception`)
    server.close(()=>{
    process.exit(1)
    
    })
    })
    //database connection
dbconnect()

if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config()
}
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_SECRET
})


//server
const server=app.listen(process.env.port,()=>{
    console.log('server is running on port ',process.env.port)
})
// unhandled promise rejection
process.on('unhandledRejection',(err)=>{
console.log(` error : ${err.message}`)
console.log(` shutting down the server due to unhandled promise rejection`)
server.close(()=>{
process.exit(1)

})
})


