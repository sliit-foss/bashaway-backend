import * as groupRepository from '../repository/group';

export const create = async (data, user) => {
    const groupExists = await groupRepository.findOne({ admin: user._id });
    if (groupExists) return { status: 400, message: 'You are already registered in a group' }
    const group = await groupRepository.create({ ...data, admin: user._id });
    return { data: { ...(JSON.parse(JSON.stringify(group))), admin: user } };
}

export const getAll = async () => { }
export const getById = async () => { }
export const update = async () => { }
export const generateInvite = async () => { }
export const joinGroup = async () => { }
export const leaveGroup = async () => { }