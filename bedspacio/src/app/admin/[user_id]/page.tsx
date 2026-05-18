"use client"

import Manage from '@/asset/icon/settings.svg'
import axios from 'axios'
import { useState } from 'react'
import { useAuth } from "@/context/AuthContext"

import ErrorToast from '@/components/admin/Toast/ErrorToast'
import SuccessToast from '@/components/admin/Toast/SuccessToast'
import { DefaultAvatar } from '../manage/DefaultAvatar'

export default function UserProfile () {

    const user = useAuth();
    console.log('User data: ', user)

    const [fullname, setFullname] = useState<string | undefined>(user?.fullname);
    const [username, setUsername] = useState<string | undefined>(user?.username);
    const [imageBlob, setImageBlob] = useState<File | null>(null); 
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const [ edit, setEdit ] = useState({
        name: false,
        username: false,
    })

    const toggleEdit = (field: keyof typeof edit) => {
        setEdit(prev => {
            const isEditing = prev[field];

            // If currently editing → user clicked "Cancel"
            if (isEditing) {
                if (field === "name") {
                    setFullname(user?.fullname || "");
                }

                if (field === "username") {
                    setUsername(user?.username || "");
                }
            }

            return {
                ...prev,
                [field]: !prev[field]
            };
        })
    };


    const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (file) {
                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                }

                setImagePreview(URL.createObjectURL(file));
                setImageBlob(file);
            }
        } catch (err) {
            setError('Image upload unsuccessfull!');
            console.log('Failed to upload image: ', err);
        }
    }

    const imageSrc = 
        imagePreview ||
        (user?.profile_image
            ? `http://localhost:5000/file/user/${user?.profile_image}`
            : undefined
        ) 


    const handleProfileChange = async (id: number) => {
        const base_url = 'http://localhost:5000'

        try {
            const profileData = new FormData();

            const fullnameChanged = fullname !== user?.fullname;
            const usernameChanged = username !== user?.username;

            if (fullnameChanged) {
                profileData.append('fullname', String(fullname));
            }

            if (usernameChanged) {
                profileData.append('username', String(username));
            }

            if (imageBlob) {
                profileData.append('profile_image', imageBlob)
            }

            const user_updated = await axios.patch(`${base_url}/user/v1/profile/${id}`,
                profileData, { withCredentials: true }
            );

            console.log('User profile updated: ', user_updated);
            setSuccess('Update successful');

            setTimeout(() => setSuccess(''), 3500);

        } catch (err) {
            console.error('Error uploading image: ', err);
        }
    }
    

    const checkChanges = fullname !== user?.fullname || username !== user?.username || imageBlob;

    return (
        <>
            <div className='flex w-full justify-center items-center py-[4rem]'>
                <div className="relative flex flex-col w-[600px] items-center justify-center h-[auto] bg-[#FAFAFA] rounded-[10px] p-[2rem] gap-[2rem]">
                    <span className="text-[24px] text-[#1D242B] font-bold whitespace-nowrap">Manage Profile</span>

                    <div className='flex flex-col w-full gap-[1rem] items-center justify-center'>
                        <div className='flex items-center justify-start w-full gap-[2rem] pb-[1rem]'>
                            <figure className='w-[150px] h-[150px] bg-[#1D242B]/25 rounded-full overflow-hidden'>
                                {imageSrc ? (
                                    <img src={imageSrc} alt="profile-image" className='w-full h-full object-cover'/>
                                ) : (
                                    <DefaultAvatar name={user?.fullname} />
                                )}
                            </figure>

                            <div className='flex flex-col gap-[1rem]'>
                                <input type="file" name="user_profile" onChange={handleImagePreview} id="user_profile_image" hidden />
                                <label htmlFor='user_profile_image' className='w-fit bg-[#1D242B] text-[#FAFAFA] px-3 py-2 rounded-[10px] cursor-pointer hover:bg-[#1D242B]/90 active:bg-[#1D242B]'>Change Image</label>
                                <span className='text-[14px] w-[200px] leading-tight'>(Upload a professional image because it will be displayed on the website)</span>
                            </div>
                        </div>

                        <div className={`grid grid-cols-[1fr_3fr_1fr] place-items-center justify-items-start w-full gap-2 border-2 ${edit.name === false ? 'border-[#1D242B]/25 ' : 'border-[#0077C0]'} rounded-[10px] p-[1rem]`}>
                            <span className='text-[#1D242B] text-[14px]'>Name</span>
                            <input type="text"  className={`w-full font-bold focus:outline-none`} value={fullname} onChange={(e) => setFullname(e.target.value)} disabled={edit.name === false}/> {/* CHANGE THIS LATER */}

                            <div className='flex w-full items-center justify-end'>
                                {edit.name === false ? (
                                    <button onClick={() => toggleEdit('name')} className='text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer'>Edit</button>
                                ) : (
                                    <button onClick={() => toggleEdit('name')} className='text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer'>Cancel</button>
                                )}
                            </div>
                        </div>

                        <div className={`grid grid-cols-[1fr_3fr_1fr] place-items-center justify-items-start w-full gap-2 border-2 ${edit.username === false ? 'border-[#1D242B]/25 ' : 'border-[#0077C0]'} rounded-[10px] p-[1rem]`}>
                            <span className='text-[#1D242B]'>Username</span>
                            <input type="text"  className='w-full font-bold focus:outline-none' value={username} onChange={(e) => setUsername(e.target.value)} disabled={edit.username === false}/> {/* CHANGE THIS LATER */}
                            <div className='flex w-full items-center justify-end'>
                                {edit.username === false ? (
                                    <button onClick={() => toggleEdit('username')} className='text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer'>Edit</button>
                                ) : (
                                    <button onClick={() => toggleEdit('username')} className='text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer'>Cancel</button>
                                )}
                            </div>
                        </div>

                        <div className='group grid grid-cols-[1fr_3fr_1fr] w-full gap-[1rem] border-2 border-[#1D242B]/25 rounded-[10px] p-[1rem]'>
                            <span className='text-[#1D242B]'>Role</span>
                            <span className='w-full font-bold'>Property Manager</span> {/* CHANGE THIS LATER */}
                        </div>

                        {/* <button className='p-3 bg-[#0077C0] hover:bg-[#0077C0]/90 active:bg-[#0077C0] text-[#FAFAFA] rounded-[10px] cursor-pointer'>Continue</button> */}

                        <div className={`grid grid-cols-[1fr_3fr_1fr] w-full gap-[1rem] border-2  border-[#1D242B]/25 rounded-[10px] p-[1rem]`}>
                            <span className='text-[#1D242B]'>Password</span>
                            <span className='font-bold'>********</span>
                            <div className='flex w-full items-center justify-end'>
                                <button className='text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer'>Change</button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center w-full gap-2" >
                            {checkChanges && (
                                <button onClick={() => handleProfileChange(user?.id)} className='bg-[#0077C0] text-[#FAFAFA] p-2 px-4 rounded-[10px] cursor-pointer'>Update</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {error && <ErrorToast message={error} />}
            {success && <SuccessToast message={success} />}
        </>
    )
}