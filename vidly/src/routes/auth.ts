import * as crud from "../crud/user"; 
import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
    const { error } = crud.authUser(req.body);
    
    if (error) return res.status(400).send(error.details[0].message);
    else {
        await crud.auth(req.body.email, req.body.password)
                .then(result => {
                    if (result === 400)
                        res.status(400).send("Invalid email or password");
                    else    res.send(result);
                })
                .catch(err => res.status(400).send(err));
    }
});

export default router;