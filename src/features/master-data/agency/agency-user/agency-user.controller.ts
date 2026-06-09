import { Request, Response } from 'express';
import { z } from 'zod';
import { AgencyUserRepositoryClass } from './agency-user.repository';
import { paginate } from '@/util/pagination';
import { paramId } from '@/util/params';
import { getActor } from '@/util/actor';
import { Error } from '@/error/index';
import type { AgencyUserRow } from './agency-user.model';

const AgencyUserSchema = z.object({
  agencyId: z.uuid(),
  userId: z.uuid(),
});

function toResponse(row: AgencyUserRow) {
  return {
    id: `${row.agencyId}:${row.userId}`,
    ...row,
  };
}

export class AgencyUserControllerClass {
  constructor(private agencyUserRepository: AgencyUserRepositoryClass) {}

  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page ?? 1);
      const pageSize = Number(req.query.pageSize ?? 10);
      const data = await this.agencyUserRepository.list({
        agencyId: req.query.agencyId as string | undefined,
        userId: req.query.userId as string | undefined,
      });
      const mapped = data.map(toResponse);
      res.status(200).json({ success: true, message: 'OK', ...paginate(mapped, page, pageSize) });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async getByKey(req: Request, res: Response) {
    try {
      const row = await this.agencyUserRepository.getByKey(
        paramId(req.params.agencyId),
        paramId(req.params.userId),
      );
      if (!row) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'OK', data: toResponse(row) });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = AgencyUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message, data: null });
      }

      const exists = await this.agencyUserRepository.exists(parsed.data.agencyId, parsed.data.userId);
      if (exists) {
        return res.status(409).json({ success: false, message: Error.CONFLICT, data: null });
      }

      const data = await this.agencyUserRepository.create({
        ...parsed.data,
        createdBy: getActor(req),
        updatedBy: getActor(req),
      });
      res.status(201).json({ success: true, message: 'Agency user linked', data: toResponse(data) });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const agencyId = paramId(req.params.agencyId);
      const userId = paramId(req.params.userId);
      const data = await this.agencyUserRepository.update(agencyId, userId, getActor(req));
      if (!data) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'Agency user updated', data: toResponse(data) });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const agencyId = paramId(req.params.agencyId);
      const userId = paramId(req.params.userId);
      const row = await this.agencyUserRepository.getByKey(agencyId, userId);
      if (!row) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });

      const deleted = await this.agencyUserRepository.remove(agencyId, userId);
      if (!deleted) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'Agency user removed', data: toResponse(row) });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }
}
