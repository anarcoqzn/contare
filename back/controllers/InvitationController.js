const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

const User = mongoose.model("User");
const Invitation = mongoose.model("Invitation");
const Expense = mongoose.model("Expense")

module.exports = {
    
    async invite(req,res){
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });

            User.findById(decoded.id, 
                { password: 0 }, 
                async function (err, userFrom) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!userFrom) return res.status(404).send("Nenhum usuário encontrado.");
                    
                    User.findOne({email:req.body.participant},async function(err,userTo){
                        if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                        if (!userTo) return res.status(404).send("Nenhum usuário ".concat(req.body.participant).concat(" encontrado."));

                        await Invitation.create({
                            from:userFrom,
                            to:userTo.id,
                            expense:req.body.expense
                        })
                        return res.status(200).send(await User.findByIdAndUpdate(userTo.id,userTo,{new:true}))
                    })
                }
            )
        })
    },
    
    async accept(req,res){
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });

            User.findById(decoded.id, 
                { password: 0 }, 
                async function (err, user) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!user) return res.status(404).send("Nenhum usuário encontrado.");

                    const invitationId = req.body.invitationId;

                    Invitation.findById(invitationId,async function(err,invitation){
                        if(err) return res.status(404).send("Houve um problema ao encontrar o convite")
                        if(!invitation) return res.status(404).send("Este convite não foi encontrado.")

                        Expense.findById(invitation.expense,async function(err,expense){
                            if(err) return res.status(404).send("Houve um problema ao encontrar a despesa")
                            if(!invitation) return res.status(404).send("Esta despesa não foi encontrada.")

                            expense.participants.push({
                                _id: user.id,
                                payValue:  req.body.payValue,
                                status: false
                            })
                            expense.participants.save;
                            await Expense.findByIdAndUpdate(expense.id,expense,{new:true})
                        });
                        await Invitation.findByIdAndRemove(invitationId);
                        return res.status(200).send("Convite aceito com sucesso!")
                    })
                }
            )
        })
    },
    async refuse(req,res){
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ user: {}, message: "Nenhum token foi fornecido." });
        
        jwt.verify(token, authConfig.secret, function(err, decoded) {
        
            if (err) return res.status(500).send({ user: {}, message: "Falha ao autenticar token." });

            User.findById(decoded.id, 
                { password: 0 }, 
                async function (err, user) {
                    if (err) return res.status(500).send("Houve um problema ao encontrar o usuario");
                    if (!user) return res.status(404).send("Nenhum usuário encontrado.");

                    const invitationId = req.body.invitationId;

                    Invitation.findById(invitationId, async function(err,invite){
                        if (err) return res.status(500).send("Houve um problema ao encontrar o convite");
                        if (!invite) return res.status(404).send("Nenhum convite encontrado.");

                        await Invitation.findByIdAndRemove(invitationId)
                        return res.status(200).send("Convite recusado com sucesso!")
                    });
                }
            )
        })
    }
}