
import { middleware } from "../middleware/auth";
import * as crud from "../crud/user";
import { Router } from 'express';
import generateAuthToken from "../crud/token"

const router = Router();

router.get('/me', middleware, async (req, res) => {
    await crud.user(req.user.id)
                .then(result => {
                    if (result === 400)
                        res.status(400).send("FATAL ERROR, User NOT found");
                    else    res.send(result);
                })
                .catch(err => res.status(404).send(err))
});

router.post('/', async (req, res) => {
    const { error } = crud.validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    else {
        await crud.create(req.body)
            .then(result => {
                if(result === 409)
                    res.status(409).send("User already exists!");
                else {
                    const token = generateAuthToken(result);
                    //first arg: name of header; second arg: value === for header()
                    res.header('x-auth-token', token).send(result); 
                }}) 
            .catch(err => res.send(`Error! couldn't create new user: ${ err }`));
    }
});

export default router;