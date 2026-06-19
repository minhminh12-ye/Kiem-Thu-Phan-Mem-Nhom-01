  import createError from "http-errors";
  import express from "express";
  import path from "path";
  import cookieParser from "cookie-parser";
  import logger from "morgan";
  import { fileURLToPath } from "url";
  import userRouter from "./routes/admin/users.js";
  import indexRouter from "./routes/index.js";
  import productRouter from "./routes/admin/products.js";
  import authRouter from "./routes/auth.js";
  import categoryRouter from "./routes/admin/category.js";
  import brandRouter from "./routes/admin/brands.js";
  import statsRouter from "./routes/admin/stats.js";
  import cartRouter from "./routes/cart.js";
  import ordersRouter from "./routes/orders.js";
  import cors from 'cors';

  const app = express();

  // Fix __dirname cho ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.set('views', path.resolve(__dirname, './views'));
  app.set('view engine', 'ejs');

  app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }))
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.resolve(__dirname, './public')));
  app.use('/', indexRouter);
  app.use('/users', userRouter);
  app.use('/products', productRouter);
  app.use('/api/auth', authRouter);
  app.use('/category', categoryRouter);
  app.use('/brands', brandRouter);
  app.use('/api/stats', statsRouter);
  app.use('/cart', cartRouter);
  app.use('/api/orders', ordersRouter);

  // catch 404
  app.use((req, res, next) => {
    next(createError(404));
  });

  // error handler
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

  export default app;
