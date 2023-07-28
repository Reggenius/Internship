import { middleware } from '../middleware/auth'
import * as crud from "../crud/customer";
import { Router } from 'express';
const router = Router();

router.get('/',  async (req, res) => {
    await crud.customers()
        .then(result => res.send(result))
        .catch(err => console.log("Error: " + err));
});

router.get('/:id',  async (req, res) => {
    await crud.customer(req.params.id)
        .then(result => {
            if (result === 404)
                res.status(404).send("Customer with given ID was not found");
            else    res.send(result)
        })
        .catch(err => res.status(404).send(err));
});

router.post('/', middleware, async (req, res) => {
    const { error } = crud.validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
        await crud.create( req.body.name, req.body.phone, req.body.isGold)
                .then(result => res.send(result))
                .catch(err => res.send(`Error! couldn't create customers: ${ err }`));
    }
});

router.put('/:id', middleware, async (req, res) => {
    const { error } = crud.validateCustomer(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    else {
        await crud.update(req.params.id, req.body)
            .then(result => {
                if (result === 404)
                    res.status(404).send("Customer with given ID was NOT found");
                else    res.send(result);
            })
            .catch(err => res.status(404).send(err));
    }
});

router.delete('/:id', middleware, async (req, res) => {
    await crud.destroy(req.params.id)
        .then(result => {
            if (result === 404)
                res.status(404).send("Customer with the given ID does not exist.");
                else    res.send(result);
        })
        .catch(err => res.send(err));
});

export default router;