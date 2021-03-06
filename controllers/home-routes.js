const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, Posts, Comments } = require('../models');

router.get('/', async (req, res) => {
    try{
        const postData = await Posts.findAll({
            include: [
                {
                    model: User,
                    attributes: ['user_name']
                }
            ],
        });

        const posts = postData.map((post) => 
            post.get({ plain: true})    
        );

        // console.log(posts);

        res.render('home-page', {
            posts,
            status: req.session.status,
            userData: req.session.userData,
            postData: req.session.postData,
            newComment: req.session.newcomment,
            loggedIn: req.session.loggedIn,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/dashboard', async (req, res) => {
    try{

        const userData = await User.findAll();

        const users = userData.map((user) => 
            user.get({ plain: true })    
        );

        if(req.session.loggedIn) {
            const postData = await Posts.findAll({
                where: {
                    userID: req.session.userID,
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_name']
                    }
                ],
            })

            const posts = postData.map((post) =>
                post.get({ plain: true })
        );
        // console.log(posts);
        res.render('dashboard-page', {
            users,
            posts,
            loggedIn: req.session.loggedIn,
            userData: req.session.userData,
            showNewPost: req.session.showNewPost,
        });
        } else {
        
        // console.log('Second Check')
        // console.log(req.session.showNewPost);

        res.render('dashboard-page', {
            users,
            loggedIn: req.session.loggedIn,
            userData: req.session.userData,
            showNewPost: req.session.showNewPost,
        });
    };
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Route to get one Post And Comments
router.get('/post/:id', async (req, res) => {
    try{ 
        const postData = await Posts.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['user_name']
                }
            ],
        });

        const commentData = await Comments.findAll({
            where: {
                postID: req.params.id,
            },
            include: [
                {
                    model: User,
                    attributes: ['user_name']
                }
            ],
        });
        
        if(!postData) {
            res.status(404).json({message: 'No post with this id!'});
            return;
        }

        const post = postData.get({ plain: true });

        const comments = commentData.map((comment) =>
            comment.get({ plain: true })
        );

        console.log(post);
        // console.log(comments);

        res.render('single-post', {
            post,
            comments,
            loggedIn: req.session.loggedIn,
        });

      } catch (err) {
          res.status(500).json(err);
      };     
  });

// Route to get one Post from Dashboard
router.get('/dashboard/post/:id', async (req, res) => {
    try{ 
        const postData = await Posts.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['user_name']
                },
            ],
        });

        // const commentData = await Comments.findAll({
        //     where: {
        //         postID: req.params.id,
        //     },
        //     include: [
        //         {
        //             model: User,
        //             attributes: ['user_name']
        //         }
        //     ],
        // });
        
        if(!postData) {
            res.status(404).json({message: 'No post with this id!'});
            return;
        }

        const post = postData.get({ plain: true });

        // const comments = commentData.map((comment) =>
        //     comment.get({ plain: true })
        // );

        // console.log('Right Here');
        // console.log(comments);
        // console.log(post);

        res.render('single-dash-post', {
            post,
            loggedIn: req.session.loggedIn,
            userID: req.session.userID
            // comments,
        });

      } catch (err) {
          res.status(500).json(err);
      };     
  });


router.get('/login', async (req, res) => {
    res.render('login-page');
});



// Logout
router.post('/api/users/logout', (req, res) => {
    // When the user logs out, destroy the session
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

module.exports = router;