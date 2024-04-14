const express= require('express')
const Router= express.Router()
const fileUpload= require('express-fileupload')
Router.use(fileUpload())



Router.post('/upload', (req, res)=>{
    console.log(req.files)
    const file= req.files.file
    console.log(file)
    file.mv('./cedula/' + file.name)
    
    
})

module.exports= Router