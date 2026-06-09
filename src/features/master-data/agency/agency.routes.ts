import { Router } from 'express';
import { agencyController } from '@/composition-root.js';
import authenticateJWT from '@/middlewares/authenticate-jwt';

const router = Router();

router.use(authenticateJWT);

router.get('', agencyController.list.bind(agencyController));
router.get('/:id', agencyController.getById.bind(agencyController));
router.post('', agencyController.create.bind(agencyController));
router.put('/:id', agencyController.update.bind(agencyController));
router.delete('/:id', agencyController.remove.bind(agencyController));

export default router;
