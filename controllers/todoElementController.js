const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const Company = require("./../models/Company");
const Collection = require("./../models/ToDoCollection");
const TodoElement = require("./../models/ToDoElement");
const AppError = require("./../utils/appError");

//Create a new todocollection
exports.createTodo = catchAsync(async (req, res, next) => {
  console.log(req.body)
  var CollectionDetails = await Collection.findById(req.body.collectionid);
  //Creates the todo element with appropriate parameters

  let dueDate = ""
  if(req.body.due_date !== ""){
    dueDate = new Date(req.body.due_date.split('/')[1] + "/"
    + req.body.due_date.split('/')[0] + "/"
    + req.body.due_date.split('/')[2] );
  }

  var creationDate = new Date(req.body.creation_date.split('/')[1] + "/" 
  +  req.body.creation_date.split('/')[0] + "/" 
  + req.body.creation_date.split('/')[2]);
  console.log(creationDate)

  var newTodo = await TodoElement.create({
    title: req.body.title,
    collectionID: req.body.collectionid,
    description: req.body.description,
    assigned_users: req.body.assigned_users,
    progress_status: req.body.progress_status,
    due_date: dueDate,
    creation_date: creationDate
  });
  //Updates the collection with the appropraite data
  CollectionDetails.to_do_elements.push(newTodo.id);
  await Collection.findByIdAndUpdate(CollectionDetails.id, CollectionDetails, {
    new: true
  });
  res.status(200).json({
    status: "success",
    data: newTodo,
    collection: CollectionDetails
  });
});

//Returns a given todo element provided the correct id
exports.getAGivenTodo = catchAsync(async (req, res, next) => {
  var todoDetails = await TodoElement.findById(req.query.todo_id);
  res.status(200).json({
    status: "success",
    data: {
      todoDetails
    }
  });
});

//Get all todo elements in a collection
exports.getAlltodoInCollection = catchAsync(async (req, res, next) => {
  const collectionData = await Collection.findById(req.query.collection_id);
  var answer = [];
  for (var x = 0; x < collectionData.to_do_elements.length; x++) {
    answer.push(await TodoElement.findById(collectionData.to_do_elements[x]));
  }
  res.status(200).json({
    status: "success",
    data: answer
  });
});

//Deletes a given collection and its associated collection values
exports.deleteATodoElementGivenID = catchAsync(async (req, res, next) => {
  console.log(req.query.todo_id)
  var todoDetails = await TodoElement.findById(req.query.todo_id);
  var collectionData = await Collection.findById(todoDetails.collectionID);
  console.log(todoDetails)
  console.log(collectionData)
  //Delete a todo element form a collection
  for (var x in collectionData.to_do_elements.length) {
    if (collectionData.to_do_elements[x] == todoDetails.id) {
      collectionData.to_do_elements.splice(x, 1);
      break;
    }
  }
  await Collection.findByIdAndUpdate(collectionData.id, collectionData, {
    new: true
  });

  //Remove the todo element details
  await TodoElement.findByIdAndDelete(req.query.todo_id);
  res.status(200).json({
    status: "success",
    data: "data has been deleted"
  });
});

//Adds a given todo element to a collection
exports.updateATodoElement = catchAsync(async (req, res, next) => {
  let dueDate = ''
  if(req.body.due_date !== ""){
    dueDate = new Date(req.body.due_date.split('/')[1] + "/"
    + req.body.due_date.split('/')[0] + "/"
    + req.body.due_date.split('/')[2] );
  }


  var creationDate = new Date(req.body.creation_date.split('/')[1] + "/" 
  +  req.body.creation_date.split('/')[0] + "/" 
  + req.body.creation_date.split('/')[2]);

  var updatedTodo = {
    title: req.body.title,
    collectionID: req.body.collectionid,
    description: req.body.description,
    assigned_users: req.body.assigned_users,
    progress_status: req.body.progress_status,
    due_date: dueDate,
    creation_date: creationDate
  };

  await TodoElement.findByIdAndUpdate(req.body.todoid, updatedTodo, {
    new: true
  });

  res.status(200).json({
    status: "success",
    data: updatedTodo
  });
});
