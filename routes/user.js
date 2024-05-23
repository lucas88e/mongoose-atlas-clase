const express = require("express")
const router =express.Router();
const Task = require("../models/task.js")
let taskList=[]
const {body,validationResult} = require("express-validator")
const validarBody =[	
body('title').trim().notEmpty().withMessage('Title is required'),
body('completed').isBoolean(false).withMessage("Don be altered")]


function validate( req,res,next){
    console.log(req.params)
        const errors = validationResult
        (req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    
    next()
}

router.post("/create", async(req,res)=>{
    try{
const task = await Task.create(req.body);
taskList.push(task)
res.status(201).send(task)
    }
    catch(error){
        console.log(error)
        res.status(500).send({message:"There was a problem to trying to create a task"})
    }
})
router.get("/",async(req,res)=>{
    try{
        res.status(201).send(taskList)

    }
    catch{
res.status(500).send({message: "There was a problem to trying to get the tasks"})
    }
})

router.get("/id/:_id",async(req,res)=>{
    try{
        const id =req.params._id
       const task=await taskList.find((task)=>
            task.id === id
           )
           if(!task){
            return res.json({error:"Task not found"})
           }
        res.send(task)
    }
    catch{
res.status(500).send({message: "There was a problem to trying to get the tasks"})
    }
})
router.put("/markAsCompleted/:_id", async(req,res)=>{
    const id =req.params._id
    const taskIndex= taskList.findIndex((task)=>
        task.id === id
       )
    if (taskIndex===-1) {
        return res.status(404).json({ error: 'Task ID not found' })
    }

    taskList[taskIndex].completed = true;
    res.json(taskList[taskIndex])

})
router.put("/id/:_id",validarBody,validate, async(req,res)=>{
    try{const id =req.params._id
    const updated = req.body
    const taskIndex= taskList.findIndex((task)=>
        task.id === id
       )
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task ID not found' })
    }

    taskList[taskIndex] = { ...taskList[taskIndex], ...updated }
    res.status(200).json(taskList[taskIndex])}
    catch(error){
        console.log(error)
        res.status(500).send({message: "There was a problem to trying to put the task"})

    }
    

})
router.delete("/id/:_id", (req,res)=>{
    try{
        const id =req.params._id
       const taskIndex= taskList.findIndex((task)=>
            task.id === id
           )
           if(!taskIndex===-1){
            return res.json({error:"Task ID not found"})
           }
           const deleteTask =taskList.splice(taskIndex,1)
        res.status(201).send(`${deleteTask} Task deleted succesfull`)
    }
    catch{
res.status(500).send({message: "There was a problem to trying to delete the task"})
    }})
module.exports = router