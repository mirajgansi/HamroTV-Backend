const User = require('../model/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async(req, res)=>{
    const {username, password} = req.body;
    //validate username and password
    if(!username || !password){
        return res.status(400).json({
            error: "Please Insert username and password"
        })
    }
    try{
        const checkExistingUser = await User.findOne({where: {username}})
        if(checkExistingUser){
        
            return res.status(400).json({
                error: "New user required"
            })
           
        }
        const saltRound = 10;
        const hashpassword = await bcrypt.hash(password, saltRound)

        const newUser = await User.create({username, password: hashpassword});
        res.status(200).json({message: "Registartion Successful....."});

    }
    catch(error){
        console.log(error)
        res.status(500).json({error: "Something went Wrong"});
    }

}

const loginUser = async(req, res) =>{
    const {username, password} = req.body;
     //validate username and password
    if(!username || !password){
        return res.status(400).json({
            error: "Please Insert username and password"
        })
    }
    try{
        const user = await User.findOne({where: {username}})
        if(!user){
            return res.status(400).json({
                error: "New user required"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                error: "Insert proper password!!!!"
            })
        }
        const token = jwt.sign(
            {id: user.username, username: user.username},
            process.env.JWT_SECRET || 'FVHJAFJHSFVBSFBSSFJSF',
            {expiresIn: '24h'}

        )
        res.status(200).json({message: "Successfully Logged in", token},
            

        )
    }
    catch(error){
        res.status(500).json({error: "Something went Wrong"});
        console.log(error)
    
    }

}
// const getUser = async(req, res)=>{

//     try{
//         const tests = await User.findAll();
//         res.status(200).json(tests);

//     }
//     catch(error){
//         res.status(500).json({error: "Failed to Load"})
//     }
// }

// const createUser = async(req, res)=>{
    
//     try{
        
// const {username, password} = req.body;

// //Hash the password
// const newtest = await User.create({username, password})

// res.status(200).json(newtest);
//     }
//     catch(error){
//         res.status(500).json({error: "Failed to Load"})
//         console.log(error)
//     }

// }

// const updateUser = async(req, res)=>{
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         await user.update(req.body);
//         res.json(user);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// }

// const deleteUser = async(req, res)=>{
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         await user.destroy();
//         res.json({ message: 'User deleted' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

// module.exports = {createUser, getUser, deleteUser, updateUser}
module.exports = {registerUser, loginUser}