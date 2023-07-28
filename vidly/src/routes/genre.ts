import { middleware } from '../middleware/auth'
import { authAdmin } from '../middleware/admin';
import * as crud from "../crud/genre";
import { Router } from 'express';
const router = Router();

router.get('/',  async (req, res) => {
    await crud.genres()
        .then(result => res.send(result))
        .catch(err => console.log("Error: " + err));
});

router.get('/:id',  async (req, res) => {
    await crud.genre(req.params.id)
        .then(result => {
            if(result === 404)
                res.status(404).send('The genre with the given ID was not found.');
            else
                res.send(result);
        })
        .catch(err => res.status(404).send(err));
});

router.post('/', middleware, async (req, res) => {
    const { error } = crud.validateGenre(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    else {
        await crud.create(req.body.name)
            .then(result => res.send(result))
            .catch(err => res.send(`Error! couldn't create Genre: ${ err }`));
    }
});

router.put('/:id', middleware,  async (req, res) => {
    const { error } = crud.validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    else {
        await crud.update(req.params.id, req.body.name)
            .then(result => {
                if(result === 404)
                    res.status(404).send('The genre with the given ID was not found.');
                else 
                    res.send(result);
            })
            .catch(err => res.status(404).send(`An error occured: ${ err }`));
    }
});

router.delete('/:id', [middleware, authAdmin], async (req, res) => {
    await crud.destroy(req.params.id)
        .then(result => {
            if(result === 404)
                res.status(404).send('The genre with the given ID was not found.');
            else
                res.send(result);
        })
        .catch(err => res.send(err));
});

export default router;

