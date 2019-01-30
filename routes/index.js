var express = require('express');
var router = express.Router();
const bcrypt =  require('bcrypt');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('proyecto0', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

generateHash = function(pass){
  return bcrypt.hashSync(pass,bcrypt.genSaltSync(8),null);
};

validPassword = function(pass,dbpass){
  return bcrypt.compareSync(pass,dbpass)
};

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const User = sequelize.define('Users', {
    email: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING
    }
  });

  const Event = sequelize.define('Events', {
    owner: {
      type: Sequelize.STRING(30),
      references:{
        model: User,
        key:'email'
      }
    },
    name: {
      type: Sequelize.STRING(40)
    },
    category: {
      type: Sequelize.ENUM,
      values: ['Seminario','Conferencia','Congreso','Curso']
    },
    place: {
      type: Sequelize.STRING(30)
    },
    address: {
      type: Sequelize.STRING(50)
    },
    start_date: {
      type: Sequelize.DATEONLY
    },
    end_date: {
      type: Sequelize.DATEONLY
    },
    presencial: {
      type: Sequelize.BOOLEAN
    }
  });
  
  // force: true will drop the table if it already exists
  User.sync({force: false}).then(() => {
    // Table created
    console.log('Tabla Users')
    /* return User.create({
      email: 'John@email.com',
      password: 'cloud123'
    }); */
  });

  Event.sync({force: false}).then(() => {
    /* return Event.create({
      owner:'John1@email.com',
      name:'Proyecto0',
      category:'Seminario',
      place:'Uniandes',
      address:'calle falsa 123',
      start_date:Date.now(),
      end_date:new Date(Date.UTC(2019,0,1)),
      presencial:false
    }) */
  });

  User.findByPk('osabogal@gmail.com').then(data => {
    console.log('Usuarios-------',data);
  });

/* GET eventos */
router.get('/api/eventos', function(req, res) {
  Event.findAll().then(data => {
    res.send(data);
  })
});

//Registro
router.post('/api/signup', (req,res) => {
  const {body} = req;
  let {email, password} = body;
  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }
  email = email.toLowerCase();
  email = email.trim();
  User.findByPk(email).then(data => {
    if (data !== null) {
      return res.send({
        success: false,
        message: 'Error: Account already exist.'
      });
    }
    //TODO: encriptar pass
    else {
      password = generateHash(password);
      User.create({
        email:email,
        password:password
      }).thenReturn(res.send({
        success: true,
        message: 'Signed up'
      }));
    }
  });
});

//Inicio Sesión
router.post('/api/signin', (req,res) =>{
  const {body} = req;
  let {email,password} = body;
  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }
  email = email.toLowerCase();
  email = email.trim();
  //TODO hash Bcrypt
  User.findOne({
    where:{
      email:email,
    }
  }).then(data => {
    if (data!=null){
      if(!validPassword(password,data.password)){
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }
      else{
        return res.send({
          success: true,
          message: 'Valid sign in'
        });
      }
    }
  });
});

//Eventos reciente->antiguo por usuario
router.post('/api/eventsUser', (req,res) => {
  const{body} = req;
  let {user} = body;
  Event.findAll({
    attributes:['id','owner','name'],
    order:[['createdAt','DESC']],
    where:{
      owner:user 
    }
  }).then(data => {
    return res.send(data)
  })
  .catch((err) => {
    return res.send(err);
  });
})

//Evento detalle
router.post('/api/eventDetail', (req,res) => {
  const{body} = req;
  let {user,id} = body;
  Event.findOne({
    where:{
      owner:user,
      id:id
    }
  }).then(data => {
    return res.send(data)
  })
  .catch((err) => {
    return res.send(err);
  });
})


//crear evento
router.post('/api/newEvent', (req,res) =>{
  const {body} = req;
  let {owner, name,category,place,address,start_date,end_date,presencial} = body;
  Event.create({
    owner,name,category,place,address,start_date,end_date,presencial
  }).then(data => {return res.send(data)})
    .catch((err) => {
      return res.send(err);
    });
});

//editar evento
router.post('/api/eventEdit', (req,res) => {
  const{body} = req;
  let {id,owner, name,category,place,address,start_date,end_date,presencial} = body;
  Event.update({
    owner,name,category,place,address,start_date,end_date,presencial
  },
  {
    where:{id:id}
  }).then(data => {
    return res.send(data)
  })
  .catch((err) => {
    return res.send(err);
  });
})

//eliminar evento
router.post('/api/eventDelete',(req,res) => {
  const{body} = req;
  let {id,user} = body;
  Event.destroy({
    where: {
      id: id,
      owner:user
    }
  }).then(data => {
    console.log(data);
    return res.send({
      success: true,
      message: `Deleted ${data} rows.`
    });
  }).catch((err) => {
    return res.send(err);
  });
});

module.exports = router;
