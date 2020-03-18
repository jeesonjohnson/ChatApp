const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const Company = require("./../models/Company");
const Collection = require("./../models/ToDoCollection");
const TodoElement = require("./../models/ToDoElement");
const AppError = require("./../utils/appError");

//SHould be deleted on production
exports.getAllTodoElements = catchAsync(async (req, res, next) => {
  const todoData = await TodoElement.find();
  res.status(200).json({
    status: "success",
    results: todoData.length,
    data: todoData
  });
});

//Create a new todocollection
exports.createTodo = catchAsync(async (req, res, next) => {
  var CollectionDetails = await Collection.findById(req.body.collectionid);
  //Creates the todo element with appropriate parameters
  var dueDate = Date(req.body.due_date);
  var creationDate = Date(req.body.creation_date);
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
  var todoDetails = await Collection.findById(req.query.todo_id);
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
  var todoDetails = await TodoElement.findById(req.query.todo_id);
  var collectionData = await Collection.findById(todoDetails.collectionID);

  //Delete a todo element form a collection
  for (var x = 0; x < collectionData.to_do_elements.length; x++) {
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
  var dueDate = Date(req.body.due_date);
  var creationDate = Date(req.body.creation_date);
  var updatedTodo = {
    title: req.body.title,
    collectionID: req.body.collectionid,
    description: req.body.description,
    assigned_users: req.body.assigned_users,
    progress_status: req.body.progress_status,
    due_date: dueDate,
    creation_date: creationDate
  };

  console.log(updatedTodo);

  await TodoElement.findByIdAndUpdate(req.body.todoid, updatedTodo, {
    new: true
  });

  res.status(200).json({
    status: "success",
    data: updatedTodo
  });
});
