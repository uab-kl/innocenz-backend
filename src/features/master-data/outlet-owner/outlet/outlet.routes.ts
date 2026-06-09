import { Router } from 'express';
import { outletController } from '@/composition-root.js';
import authenticateJWT from '@/middlewares/authenticate-jwt';

const router = Router();

router.use(authenticateJWT);

router.get('', outletController.list.bind(outletController));
router.get('/:id', outletController.getById.bind(outletController));
router.post('', outletController.create.bind(outletController));
router.put('/:id', outletController.update.bind(outletController));
router.delete('/:id', outletController.remove.bind(outletController));

export default router;
