import { middleware } from '../middleware/auth'
import * as crud from "../crud/movie";
import { Router } from 'express';
const router = Router();

router.get('/',  async (req, res) => {
    await crud.movies()
        .then(result => res.send(result))
        .catch(err => console.log("Error: " + err));
});

router.get('/:id',  async (req, res) => {
    await crud.movie(req.params.id)
        .then(result => {
            if (result === 404)
                res.status(404).send("Genre with given ID was not found");
            else    res.send(result);
        })
        .catch(err => res.status(404).send(err));
});

router.post('/:id', middleware, async (req, res) => {
    const { error } = crud.validateMovie(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    else {
        await crud.create(req.params.id, req.body)
            .then(result => {
                if (result === 404)
                    res.status(404).send("Genre with given ID was not found");
                else    res.send(result);
            })
            .catch(err => res.send(`Error! couldn't create Genre: ${ err }`));
    }
});

router.put('/:id', middleware, async (req, res) => {
    const { error } = crud.validateMovie(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    else {
        await crud.update(req.params.id, req.body)
            .then(result => {
                if (result === 404)
                    res.status(404).send("Movie with given ID does not exist");
                else    res.send(result);
            })
            .catch(err => res.status(404).send(`An Error occured: ${ err }`));
    }
});

router.delete('/:id', middleware, async (req, res) => {
    await crud.destroy(req.params.id)
        .then(result => {
            if (result === 404)
                res.status(404).send("Movie with the given ID does not exist.");
            else    res.send(result);
        })
        .catch(err => res.send(err));
});

export default router;