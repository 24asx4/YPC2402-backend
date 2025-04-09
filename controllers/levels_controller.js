/*
  This is the controller for all levels handling
*/
const Level1 = require('../models/level1_model');
const Level2 = require('../models/level2_model');
const Level3 = require('../models/level3_model');
const levels_model = [Level1,Level2,Level3];
// add a result
const add_result = async (req, res) =>{
  const {level, acc ,time} = req.body;
  // add to the database
  try {
    const user = await levels_model[parseInt(level)-1].create({ acc, time});
    res.status(200).json({status: "success" });
    console.log("level " + level + " result received")
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get avg info
const get_avg = async (req, res) => {
  if (req.params.levels<1 || req.params.levels>3) {
    res.status(400).json({error : "no such a level"});
  }
  console.log("level " + req.params.levels + " result fetched")
  const results = await levels_model[parseInt(req.params.levels)-1].find({}).sort({createdAt: -1});
  var acc=[];
  var avg_acc=0;
  var time=[];
  var avg_time=0;
  for (var result of results){
    avg_acc+=result.acc;
    acc.push(result.acc);
    avg_time+=result.time;
    time.push(result.time);
  }
  avg_acc/=acc.length;
  avg_time/=time.length;
  res.status(200).json({avg_acc:avg_acc, avg_time:avg_time});
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
  get_avg
}