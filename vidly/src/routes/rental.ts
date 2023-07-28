import { middleware } from '../middleware/auth'
import * as crud from "../crud/rental";
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    await crud.rentals()
        .then(result => res.send(result))
        .catch(err => console.log("Error: " + err));
});

router.get('/:id',  async (req, res) => {
    await crud.rental(req.params.id)
        .then(result => {
            if(result === 404)
                res.status(404).send("Rental with given ID was not found");
            else    res.send(result)
        })
        .catch(err => res.status(404).send(err));
});

router.post('/:cId/:mId', middleware, async (req, res) => {
    const { error } = crud.validateUrl(req.params);
    
    if (error) return res.status(400).send(error.details[0].message);
    else {
        await crud.create(req.params)
                .then(result => {
                    if (result === 404)
                        res.status(404).send('Customer or Movie do NOT exist.');
                    else    res.send(result);
                })
                .catch(err => res.send(`Error! couldn't create customer: ${ err }`));
    }
});

export default router;