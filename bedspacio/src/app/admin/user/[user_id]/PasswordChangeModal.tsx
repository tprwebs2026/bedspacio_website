"use client" 

import { useState } from 'react';

// icons
import Close from '@/asset/icon/close.svg'
import Check from '@/asset/icon/check.svg'
import axios from 'axios';
import { changePassword } from '../../../../../lib/user';

interface PasswordModalProp {
    modalOpen: () => void;
    setSuccess: React.Dispatch<React.SetStateAction<string> >
}



export default function PasswordChangeModal ({
    modalOpen,
    setSuccess
} : PasswordModalProp) {

    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [passwordCondition, setPasswordCondition] = useState({
        upperlower: false,
        specialCharacters: false,
        number: false,
        minLength: false
    })

    const validatePassword = (password: string): boolean => {
        const conditions = {
            upperlower: /^(?=.*[a-z])(?=.*[A-Z])/.test(password),
            specialCharacters: /(?=.*[@$!%*?&#])/.test(password),
            number: /(?=.*\d)/.test(password),
            minLength: password.length >= 12
        };

        setPasswordCondition(conditions);

        return Object.values(conditions).every(Boolean);
    };



    const handleChangePassword = async (
        oldPass: string,
        newPass: string,
        confirmPass: string
    ) => {

        setLoading(true);

        try {

            const passwordCheck = validatePassword(newPass);

            if (!passwordCheck) return;
            
            if (newPass !== confirmPass) {
                setError('Mismatch on new password and confirm password.');
                console.log('Mismatch on new password and confirm password.');

                return;
            }

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setLoading(true);
                    resolve();
                }, 2500);
            });
            
            
            const response = await axios.patch(
                `http://localhost:5000/user/v1/password`, 
                    {
                        old_password: oldPass,
                        new_password: newPass,
                        confirm_password: confirmPass
                    },
                    {
                        withCredentials: true
                    }
            );
            console.log(response);

            // successfull password change
            modalOpen();
            setSuccess('Password updated successfully!');
            setTimeout(() => setSuccess(''), 4000);

        } catch (error: any) {

            console.log(error.message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`flex flex-col w-[400px] h-auto p-[2.5rem] rounded-[10px] bg-[#FAFAFA] shadow-md gap-[1rem]`}>  
            <div className="flex items-center justify-between w-full">
                <span className={`text-[22px] text-[#1D242B] font-bold ${loading ? 'opacity-50' : 'opacity-100'}`}>Change password</span>
                <button onClick={modalOpen}
                    className='cursor-pointer bg-[#1D242B]/15 rounded-full hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15'>
                    <Close className={'w-[30px] h-[30px] stroke-[#1D242B] stroke-2'} />
                </button>
            </div>

            <span className='leading-tight text-[#1D242B]'>Set a super strong, like monkey strong password type shit</span>

            <div className={`flex flex-col w-full gap-2 ${loading ? 'opacity-50' : 'opacity-100'}`} >
                <div className='flex flex-col w-full pb-[1.5rem] border-dashed border-b-2 border-b-[#1D242B]/25'>
                    <span className='text-[14px] font-bold opacity-80'>Current Password</span>
                    <input type="password" name="old_pass" id="old_pass" 
                        value={oldPassword} disabled={loading}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className='text-[16px] p-2 rounded-[10px] border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0]'
                    />
                </div>

                <div className='flex flex-col w-full pt-[1rem]'>
                    <span className='text-[14px] font-bold opacity-80'>New Password</span>
                    <input type="password" name="old_pass" id="old_pass"  
                        minLength={12} disabled={loading}
                        value={newPassword}
                        onChange={(e) => {
                            const value = e.target.value;

                            setNewPassword(value);
                            validatePassword(value)
                        }}
                        className={`text-[16px] p-2 rounded-[10px] border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] ${confirmPassword && confirmPassword === newPassword ? 'text-[#0077C0] border-[#0077C0]' : ''}`}
                    />
                </div>

                <div className='flex flex-col w-full pb-[1rem]'>
                    <span className='text-[14px] font-bold opacity-80'>Confirm New Password</span>
                    <input type="password" name="old_pass" id="old_pass" 
                        minLength={12} disabled={loading}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`text-[16px] p-2 rounded-[10px] border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] ${newPassword && confirmPassword === newPassword ? 'text-[#0077C0] border-[#0077C0]' : ''}`}
                    />
                </div>

                <div className='flex flex-col p-2 rounded-[10px] bg-[#1D242B]/10'>
                    <span className='text-[14px] font-bold text-[#1D242B] p-1'>Password requirements</span>
                    <div className='flex items-center'>
                        <Check className="w-[20px] h-[20px] stroke-[#1D242B] stroke-2" />
                        <span className={`text-[12px] font-bold leading-tight
                            ${passwordCondition.minLength ? 'text-[#0077C0] opacity-100' : 'text-[#1D242B] opacity-50'} `}>At least 12 characters</span>   
                    </div>

                    <div className='flex items-center'>
                        <Check className="w-[20px] h-[20px] stroke-[#1D242B] stroke-2" />
                        <span className={`text-[12px] text-[#1D242B] font-bold leading-tight
                            ${passwordCondition.upperlower ? 'text-[#0077C0] opacity-100' : 'text-[#1D242B] opacity-50'}`}>Contains uppercase & lowercase letter</span>   
                    </div>

                    <div className='flex items-center'>
                        <Check className="w-[20px] h-[20px] stroke-[#1D242B] stroke-2" />
                        <span className={`text-[12px] text-[#1D242B] font-bold leading-tight
                            ${passwordCondition.number ? 'text-[#0077C0] opacity-100' : 'text-[#1D242B] opacity-50'}`}>Contains number</span>   
                    </div>

                    <div className='flex items-center'>
                        <Check className="w-[20px] h-[20px] stroke-[#1D242B] stroke-2" />
                        <span className={`text-[12px] text-[#1D242B] font-bold leading-tight
                            ${passwordCondition.specialCharacters ? 'text-[#0077C0] opacity-100' : 'text-[#1D242B] opacity-50'}`}>Contains special character</span>   
                    </div>
                </div>
            </div>


            <div className='flex items-center w-full pt-[1rem]'>
                <button type='button' onClick={() => handleChangePassword(oldPassword, newPassword, confirmPassword)} disabled={loading}
                className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer ' }text-[16px] text-[#FAFAFA] font-bold bg-[#0077C0] w-full p-2 rounded-[10px]`}>{loading ? '...' : 'Update' }</button>
            </div>
        </div>
    )
}