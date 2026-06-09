import { Router } from 'express';
import { prController } from '@/composition-root.js';
import authenticateJWT from '@/middlewares/authenticate-jwt';

const router = Router();

router.use(authenticateJWT);

router.get('', prController.list.bind(prController));
router.get('/:id', prController.getById.bind(prController));
router.post('', prController.create.bind(prController));
router.put('/:id', prController.update.bind(prController));
router.delete('/:id', prController.remove.bind(prController));

export default router;
