import { RouteCallback } from '../../@types'
import db from '../../database/db'
import { IJobPostStatus } from './job_post_status.model'

const table = () => db<IJobPostStatus>('job_post_status')

export class JobPostStatusController {
  create: RouteCallback = function (req, res) {
    const jobPostStatusTmp: IJobPostStatus = req.body

    // Validate request
    if (!jobPostStatusTmp.name) {
      return res.status(400).send({
        message: 'Falta contenido y/o no puede estar vacio.',
      })
    }

    table()
      .insert(jobPostStatusTmp)
      .then(() => {
        return res.status(200).send({ message: 'Creado con éxito' })
      })
      .catch((error) => {
        if (error.code === '23505') {
          return res.status(409).send({ message: 'Ya existe el job post status' })
        }
        return res
          .status(500)
          .json({ message: 'Server error', messageError: error.detail })
      })
  }

  findAll: RouteCallback = function (req, res) {
    table()
      .select()
      .then((jobPostStatus: IJobPostStatus[]) => {
        return res.status(200).send(jobPostStatus)
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: 'Server error', messageError: error.detail })
      })
  }

  findOne: RouteCallback = function (req, res) {
    const jobPostStatusTmp: IJobPostStatus = req.body
    jobPostStatusTmp.id = +req.params.id

    table()
      .where({ id: jobPostStatusTmp.id })
      .then((jobPostStatus: IJobPostStatus[]) => {
        return jobPostStatus.length > 0
          ? res.status(200).send(jobPostStatus)
          : res.status(404).send({ message: 'Job post status no encontrado' })
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: 'Server error', messageError: error.detail })
      })
  }

  update: RouteCallback = function (req, res) {
    const jobPostStatusTmp: IJobPostStatus = req.body

    // Validate request
    if (!jobPostStatusTmp.name) {
      return res.status(400).send({
        message: 'Falta contenido y/o no puede estar vacio.',
      })
    }

    table()
      .where({ id: +req.params.id })
      .update({ name: jobPostStatusTmp.name })
      .then((jobPostStatus: number) => {
        return jobPostStatus > 0
          ? res.status(200).send({ message: 'Modificado con éxito' })
          : res.status(404).send({ message: 'Job post status no encontrado' })
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: 'Server error', messageError: error.detail })
      })
  }

  delete: RouteCallback = function (req, res) {
    table()
      .where({ id: +req.params.id })
      .del()
      .then((jobPostStatus: number) => {
        return jobPostStatus > 0
          ? res.status(200).send({ message: 'Borrado con éxito' })
          : res.status(404).send({ message: 'Job post status no encontrado' })
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: 'Server error', messageError: error.detail })
      })
  }
}
