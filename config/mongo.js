'use strict'

import mongoose from "mongoose";
import User from "../src/users/user.model.js";
import Category from "../src/category/category.model.js"
import { hash } from "argon2";

export const dbConnection = async() => {
    try {
        mongoose.connection.on('error', () => {
            console.log("MongoDB | could not be connected to MongoDB");
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log("Mongo | Try connection")
        });
        mongoose.connection.on('connected', () => {
            console.log("Mongo | connected to MongoDB")
        });
        mongoose.connection.on('open', () => {
            console.log("Mongo | connected to database")
        });
        mongoose.connection.on('reconnected', () => {
            console.log("Mongo | reconnected to MongoDB")
        });
        mongoose.connection.on('disconnected', () => {
            console.log("Mongo | disconnected")
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

        await createAdmin();
        await defaultCategory();

    } catch (error) {
        console.log('Database connection failed', error);
    }
};

const createAdmin = async () => {
    try {
        const user = await User.findOne({ name: 'Admin' });

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
        } else {
            console.log("Admin already exists");
        }
    } catch (error) {
        console.log('Error creating admin user', error);
    }
}

const defaultCategory = async () => {
    try {
        const admin = await User.findOne({ name: 'Admin' });

        if (!admin) {
            console.log('Admin user not found');
            return;
        }

        const category = await Category.findOne({ nameCategory: 'Cocina' });

        if (!category) {
            const newCategory = new Category({
                admin: admin._id,
                nameCategory: 'Cocina'
            });

            await newCategory.save();
            console.log('Category created successfully');
        } else {
            console.log("Category already exists");
        }
    } catch (error) {
        console.log('Error creating category', error);
    }
};