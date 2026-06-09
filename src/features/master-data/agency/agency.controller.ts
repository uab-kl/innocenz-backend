import { Request, Response } from 'express';
import { z } from 'zod';
import { AgencyRepositoryClass } from './agency.repository';
import { paginate } from '@/util/pagination';
import { paramId } from '@/util/params';
import { getActor } from '@/util/actor';
import { Error } from '@/error/index';

const AgencySchema = z.object({
  agencyName: z.string().min(1).max(100),
  agencyAddress: z.string().min(1).max(255),
  agencyContactNo: z.string().min(1).max(20),
  agencyEmail: z.email(),
  agencyLogo: z.string().min(1).max(255),
  status: z.string().default('active'),
});

export class AgencyControllerClass {
  constructor(private agencyRepository: AgencyRepositoryClass) {}

  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page ?? 1);
      const pageSize = Number(req.query.pageSize ?? 10);
      const data = await this.agencyRepository.list({
        agencyName: req.query.agencyName as string | undefined,
        status: req.query.status as string | undefined,
        agencyEmail: req.query.agencyEmail as string | undefined,
      });
      res.status(200).json({ success: true, message: 'OK', ...paginate(data, page, pageSize) });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const row = await this.agencyRepository.getById(paramId(req.params.id));
      if (!row) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'OK', data: row });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = AgencySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message, data: null });
      }

      const existing = await this.agencyRepository.getByEmail(parsed.data.agencyEmail);
      if (existing) {
        return res.status(409).json({ success: false, message: Error.CONFLICT, data: null });
      }

      const data = await this.agencyRepository.create({
        ...parsed.data,
        createdBy: getActor(req),
        updatedBy: getActor(req),
      });
      res.status(201).json({ success: true, message: 'Agency created', data });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parsed = AgencySchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message, data: null });
      }

      if (parsed.data.agencyEmail) {
        const existing = await this.agencyRepository.getByEmail(parsed.data.agencyEmail);
        if (existing && existing.id !== paramId(req.params.id)) {
          return res.status(409).json({ success: false, message: Error.CONFLICT, data: null });
        }
      }

      const data = await this.agencyRepository.update(paramId(req.params.id), {
        ...parsed.data,
        updatedBy: getActor(req),
      });
      if (!data) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'Agency updated', data });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const data = await this.agencyRepository.deactivate(paramId(req.params.id), getActor(req));
      if (!data) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'Agency deactivated', data });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }
}
