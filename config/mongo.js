'use strict'

import mongoose from "mongoose";
import User from "../src/users/user.model.js";
import { hash } from "argon2";

export const dbConnection = async() => {
    try {
        mongoose.connection.on('error', ()=>{
            console.log("MongoDB | could not be connected to MondoDB");
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', ()=>{
            console.log("Mongo | Try connection")
        });
        mongoose.connection.on('connected', ()=>{
            console.log("Mongo | connected to MongoDB")
        });
        mongoose.connection.on('open', ()=>{
            console.log("Mongo | connected to database")
        });
        mongoose.connection.on('reconnected', ()=>{
            console.log("Mongo | reconnected to MongoDB")
        });
        mongoose.connection.on('disconnected', ()=>{
            console.log("Mongo | disconnected")
        });

        await mongoose.connect(process.env.URI_MONGO,{
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        }).then(createAdmin());
    } catch (error) {
        console.log('Database connection failed', error);
    }
    
}

const createAdmin = async () => {
    try {
        const user = await User.findOne({ username: 'admin12' });

        if (!user) {
            const cryptedPassword = await hash('12345678');

            const userAdmin = new User({
                name: 'Admin',
                surname: 'Admin',
                username: 'admin12',
                email: 'admin@example.com',
                password: cryptedPassword,
                role: 'ADMIN_ROLE'
            });

            await userAdmin.save();
            console.log('Admin user created successfully');
        }else {
            console.log("Admin already exists");
        }
    } catch (error) {
        console.log('Error creating admin user', error);
    }
}