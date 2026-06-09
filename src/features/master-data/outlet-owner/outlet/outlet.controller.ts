import { Request, Response } from 'express';
import { z } from 'zod';
import { OutletRepositoryClass } from './outlet.repository';
import { paginate } from '@/util/pagination';
import { paramId } from '@/util/params';
import { getActor } from '@/util/actor';
import { Error } from '@/error/index';

const OutletSchema = z.object({
  outletOwnerId: z.uuid(),
  outletName: z.string().min(1).max(100),
  outletAddress: z.string().min(1).max(255),
  outletContactNo: z.string().min(1).max(20),
  outletEmail: z.email(),
  outletLogo: z.string().min(1).max(255),
  status: z.string().default('active'),
});

export class OutletControllerClass {
  constructor(private outletRepository: OutletRepositoryClass) {}

  async list(req: Request, res: Response) {
    try {
      const page = Number(req.query.page ?? 1);
      const pageSize = Number(req.query.pageSize ?? 10);
      const data = await this.outletRepository.list({
        outletName: req.query.outletName as string | undefined,
        status: req.query.status as string | undefined,
        outletOwnerId: req.query.outletOwnerId as string | undefined,
        outletEmail: req.query.outletEmail as string | undefined,
      });
      res.status(200).json({ success: true, message: 'OK', ...paginate(data, page, pageSize) });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const row = await this.outletRepository.getById(paramId(req.params.id));
      if (!row) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'OK', data: row });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = OutletSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message, data: null });
      }

      const existing = await this.outletRepository.getByEmail(parsed.data.outletEmail);
      if (existing) {
        return res.status(409).json({ success: false, message: Error.CONFLICT, data: null });
      }

      const data = await this.outletRepository.create({
        ...parsed.data,
        createdBy: getActor(req),
        updatedBy: getActor(req),
      });
      res.status(201).json({ success: true, message: 'Outlet created', data });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parsed = OutletSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message, data: null });
      }

      const id = paramId(req.params.id);

      if (parsed.data.outletEmail) {
        const existing = await this.outletRepository.getByEmail(parsed.data.outletEmail, id);
        if (existing) {
          return res.status(409).json({ success: false, message: Error.CONFLICT, data: null });
        }
      }

      const data = await this.outletRepository.update(id, {
        ...parsed.data,
        updatedBy: getActor(req),
      });
      if (!data) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'Outlet updated', data });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const data = await this.outletRepository.deactivate(paramId(req.params.id), getActor(req));
      if (!data) return res.status(404).json({ success: false, message: Error.NOT_FOUND, data: null });
      res.status(200).json({ success: true, message: 'Outlet deactivated', data });
    } catch {
      res.status(500).json({ success: false, message: Error.INTERNAL_SERVER_ERROR, data: null });
    }
  }
}
