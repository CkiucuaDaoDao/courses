const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
const SortMiddleware = require('./app/middlewares/SortMiddleware.js');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const route = require('./routes/index.js');

const db = require('./config/db/index.js');

db.connect();
dotenv.config();

//Middlewares
app.use(SortMiddleware);
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

app.engine(
  'hbs',
  hbs.engine({
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a+b,
      sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default';

        const icons = {
          default: 'fa-solid fa-sort',
          asc: 'fa-solid fa-arrow-up-short-wide',
          desc: 'fa-solid fa-arrow-down-wide-short'
        }

        const types = {
          default: 'desc',
          asc: 'desc',
          desc: 'asc'
        }

        const icon = icons[sortType];
        const type = types[sortType];

        return `<a href="?_sort&column=${field}&type=${type}"><i class="${icon}"></i></a>`
      }
    }
  }),
);

app.use(methodOverride('_method'))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource/views'));

console.log(path.join(__dirname));

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
