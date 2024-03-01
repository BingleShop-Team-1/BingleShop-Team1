const { User } = require('./models')

const user = new User;

user.name = 'Syaiful';
user.address = 'Jogja';
user.email = 'syaiful@mail.com';
user.password = 'pass1234';

(async () => {
    await user.save();
})

();