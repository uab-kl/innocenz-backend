import { Router } from 'express';
import { agencyUserController } from '@/composition-root.js';
import authenticateJWT from '@/middlewares/authenticate-jwt';

const router = Router();

router.use(authenticateJWT);

router.get('', agencyUserController.list.bind(agencyUserController));
router.get('/:agencyId/:userId', agencyUserController.getByKey.bind(agencyUserController));
router.post('', agencyUserController.create.bind(agencyUserController));
router.put('/:agencyId/:userId', agencyUserController.update.bind(agencyUserController));
router.delete('/:agencyId/:userId', agencyUserController.remove.bind(agencyUserController));

export default router;
