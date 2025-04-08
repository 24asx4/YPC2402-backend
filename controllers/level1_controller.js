/*
  This is the controller for user handling
*/
const Level1 = require('../models/level1_model');

// add a result
const add_result = async (req, res) =>{
  const {NPC, acc ,time} = req.body;
  // add to the database
  try {
    const user = await Level1.create({ NPC, acc, time});
    res.status(200).json({status: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get all result
const get_results = async (req, res) => {
  const results = await Level1.find({}).sort({createdAt: -1});

  res.status(200).json(results);
}

// get avg info
const get_avg = async (req, res) => {
  const results = await Level1.find({}).sort({createdAt: -1});
  var acc=[];
  var avg_acc=0;
  for (var t of results){
    avg_acc+=t.acc;
    acc.push(t.acc);
  }
  avg_acc/=acc.length;
  //var NPC=[[]];
  res.status(200).json({avg:avg_acc});
}













// get all users
const get_users = async (req, res) => {
  const users = await User.find({}).sort({createdAt: -1})

  res.status(200).json(users)
}

// get a single user
const get_user = async (req, res) => {
  const { uid } = req.params

  const user = await User.findOne({username: uid})

  if (!user) {
    return res.status(404).json({error: 'No such user'})
  }

  res.status(200).json(user)
}



// delete a user
const delete_user = async (req, res) => {
  const { uid } = req.params

  const user = await User.findOneAndDelete({username: uid})

  if (req.session.type!==admin||req.session.username!=uid){
    return res.status(400).json({error: "You don't have permission to do that!"})
  }
  
  if(!user) {
    return res.status(400).json({error: 'No such user'})
  }

  res.status(200).json(user)
}

// update a user
const update_user = async (req, res) => {
  const { uid } = req.params

  if (req.session.type!==admin||req.session.username!=uid){
    return res.status(400).json({error: "You don't have permission to do that!"})
  }
  const user = await User.findOneAndUpdate({username: uid}, {
    ...req.body
  })

  if (!user) {
    return res.status(400).json({error: 'No such user'})
  }

  res.status(200).json(user)
}

// register a user
const reg_user = async (req, res) =>{
  const {username, password, type} = req.body
  const guestTypeList=["user"];
  const allTypeList=["admin","user","boot"];
  if (!allTypeList.includes(type)){
    return res.status(400).json({error: "Threr is not such a type for account!"});
  }
  if (!req.session){
    if (!guestTypeList.includes(type)){
      return res.status(400).json({error: "You don't have permission to register this type of account!"});
    }
  }
  if (type==="admin"){
    return res.status(400).json({error: "You cannot register an admin account here. Instead, please register a normal user and modify the type in database."});
  }
  // add to the database
  try {
    const user = await User.create({ username, password, type })
    res.status(200).json({status: "success" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// login a user
const login_user = async (req,res) => {
  const {username, password} = req.body
  
  const user = await User.findOne({username})

  if (!user){
    return res.status(401).json({error: 'The user is not registered'})
  } 

  const match = await User.findOne({username,password})

  if (!match){
    return res.status(401).json({error: 'The password is incorrect'})
  }
  req.session.username = match.username
  req.session.type = match.type
  res.status(200).json({status: "login success"})
}

// logout a user
const logout_user = async (req,res) => {
  console.log('user logout')
  req.session.destroy()
  res.status(200).json({status: "logout success"})
}

// check login status
const status = async (req,res) => {
  if(!req.session.username){
    return res.status(200).json({login: false})
  }
  return res.status(200).json({login: true})
}

// get user info
const info = async (req,res) => {
  if(!req.session.username){
    console.log('not logged in')
    return res.status(401).json({error: "Not logged in"})
  }
  var username=req.session.username;
  const user = await User.findOne({username});
  var type=user.type;
  return res.status(200).json({
    username: username,
    type: type
  })
}

//get user type (to determine the permission for user)
const permission = async (req,res) => {
  if(!req.session.username){
    return res.status(200).json({type: "guest"})
  }
  var type=req.session.type;
  return res.status(200).json({
    type: type
  })
}

module.exports = {
  add_result,
  get_results,
  get_avg
}