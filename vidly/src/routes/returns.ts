//import * as crud from "../crud/rental";
import { Router } from 'express';
import { middleware } from '../middleware/auth'
import { validate } from '../middleware/validate';
import * as crud from '../crud/rental';
const router = Router();

router.post('/:cId/:mId/:rId', [middleware, validate(crud.validateReturnUrl)], async (req, res) => {
    await crud.update(req.params)
            .then(result => {
                if  (result === 404)
                    res.status(404).send('Items with the given ID NOT found.');
                else if (result === 400)
                    res.status(400).send('Return already processed.');
                else    res.status(200).send(result);
                })
            .catch(err => res.status(404).send(err) );
});

export default router;