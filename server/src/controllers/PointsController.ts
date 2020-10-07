import knex from "./../database/connection";
import { Request, Response } from "express";

class PointsController{
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction()
    
        const point = {
            image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert(point)
    
        const point_id = insertedIds[0]
    
        const pointItems = items.map((item_id: number) => {
            return { item_id, point_id }
        })
    
    
        await trx('point_items').insert(pointItems)
    
        await trx.commit()

        return response.json({...point, id: point_id })
    }

    async index(request: Request, response: Response) {
        const {city, uf, items} = request.query
        const parsedItems = String(items)
            .split(',')
            .map( item => Number(item.trim()) )

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        return response.json(points)
    }
    
    async show(request: Request, response: Response) {
        const { id } = request.params
        const point = await knex('points').select('*').where('id', id).first()
        if(!point){
            return response.status(404).json({message: "Not Found"})
        }


        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.id', 'items.title')
            point.items = items.map( item => {
                return {
                    ...item,
                    image_url: `http://localhost:3333/uploads/${item.image}`
                }
            } )
        return response.json(point)
    }
}

export default PointsController