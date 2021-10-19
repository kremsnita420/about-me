import nc from 'next-connect';
import Product from '../../models/Product';
import User from '../../models/User';
import db from '../../utils/db';
import data from '../../utils/data';

const handler = nc();
//visit http://localhost:3000/api/seed to insert sample data into db 
handler.get(async (req, res) => {
    await db.connect();
    await Product.deleteMany();
    await Product.insertMany(data.products);
    await User.deleteMany();
    await User.insertMany(data.users);
    await db.disconnect();
    res.send({ message: 'seeding successfull' });
});

export default handler;