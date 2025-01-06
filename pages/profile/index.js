import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Loading from '@/components/Loding';
import Navbar from '@/components/navbar';
import Image from 'next/image';
import profilePicture from '@/assets/images/photo.svg'
import Footer from '@/components/footer';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Profile() {

  const router = useRouter()

  const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dvgxkx9ln/image/upload";

  const cloudinaryPresets = {
    image: "profile_pic",
  };

  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([])
  const [profilePic, setProfilePic] = useState(profilePicture);

  const [profileImage,setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState({image:null})

  const [name,setName] = useState('')
  const [date_of_birth, setDateOfBirth] = useState('')
  const [education_background, setEducationBackground] = useState('')
  const [email,setEmail] = useState('')

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File size:", file.size); // ตรวจสอบขนาดไฟล์
      if (file.size <= 5 * 1024 * 1024) {
        setProfileImage((prev) => ({
          ...prev,
          image: file,
        }));
        setPreviewImage((prev) => ({
          ...prev,
          image: URL.createObjectURL(file),
        }));
      } else {
        alert("File size exceeds 5 MB");
        setProfileImage({ image: null });
      }
    }
  };

  const uploadToCloudinary = async (file, preset) => {
    const formData = new FormData();
    formData.append("file", file);  // เพิ่มไฟล์ที่ต้องการอัปโหลด
    formData.append("upload_preset", preset);  // ใช้ upload preset ที่สร้างไว้ใน Cloudinary
  
    try {
      // ส่งข้อมูลไปยัง Cloudinary
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Cloudinary Response:", response);  // ตรวจสอบผลลัพธ์จาก Cloudinary
      return response.data.secure_url;  // คืนค่าลิงก์ของภาพที่อัปโหลดสำเร็จ
  
    } catch (error) {
      // หากเกิดข้อผิดพลาด ให้แสดงข้อผิดพลาดใน console
      console.error("Cloudinary upload error:", error.response?.data || error.message);
      alert(`An error occurred while uploading your image: ${error.response?.data?.message || error.message}`);
    }
  };
  
  

  const clickToUpLoad = async () => {
    setLoading(true);
    try {
      if (profileImage && profileImage.image) {
        let imageUrl = await uploadToCloudinary(profileImage.image, cloudinaryPresets.image);
        if (imageUrl) {
          const { data, error } = await supabase
            .from('users')
            .update({ profile_picture: imageUrl })
            .eq('email', userData.email);
  
          if (error) {
            console.error("Error updating profile picture:", error);
          }
        }
      } else {
        console.log("No image selected for upload.");
      }
    } catch (error) {
      console.error("Error during image upload:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{
      if(profileImage === null){
          const {data,error} = await supabase
          .from('users')
          .update({
            name:name,
            date_of_birth:date_of_birth,
            education_background:education_background,
            email:email,
            updated_at:new Date()
          })
          .eq('email', userData.email)

          router.reload()

          if (error) {
            console.error("Error updating profile:", error);
          }

      }else{
        let imageUrl = await uploadToCloudinary(profileImage.image, cloudinaryPresets.image);

        const {data,error} = await supabase
          .from('users')
          .update({
            name:name,
            date_of_birth:date_of_birth,
            education_background:education_background,
            email:email,
            profile_picture:imageUrl,
            updated_at:new Date()
          })
          .eq('email', userData.email)

          router.reload()

          if (error) {
            console.error("Error updating profile:", error);
          }
      }

    } catch (error) {
      console.error("Error during profile update:", error);
    } finally {
      setLoading(false);
    }
  }

  const removeProfile = async () => {
    setLoading(true)
    try{
      const {data,error} = await supabase
      .from('users')
      .update({profile_picture:null})
      .eq('email',userData.email)

      if (error) {
        console.error("Error removing profile picture:", error);
      }else {
        setUserData(prevState => ({
          ...prevState,
          profile_picture: null,
        }));
        setPreviewImage({ image: null }); 
      }

    } catch (error) {
        console.error("Error during remove profile picture:", error);
      } finally {
        setLoading(false);
      }
  }

  const deletePreviewImage = () => {
    setPreviewImage({ image: null });
    setProfileImage({ image: null });
    document.getElementById("file-upload").value = "";
    console.log("หลังกด x :",userData.profile_picture);
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession(); //email auth

      if (!session) {
        setUser(null);
        setLoading(false); 
        router.push('/login')
        return;
      }

      setUser(session.user);
      console.log('seession',session.user.email);
      setLoading(false);

      const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();  // ดึงข้อมูลของแถวที่ตรงกับอีเมลเดียว
  
        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data);  // เก็บข้อมูลผู้ใช้จากฐานข้อมูล
          setName(data.name)
          setDateOfBirth(data.date_of_birth)
          setEducationBackground(data.education_background)
          setEmail(data.email)
        }

      };
      
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Navbar/>

      <div className='relative flex flex-col justify-center items-center overflow-hidden gap-8 lg:gap-16 py-10 lg:py-20'>
        <h2 className='font-medium text-2xl lg:text-4xl'>Profile</h2>

        <div className='flex flex-col lg:flex-row gap-8 lg:gap-28'>
          <div className='flex flex-col items-center justify-center gap-4'>
           {!profileImage ? (
            <div className='flex flex-col items-center justify-center gap-4'>
              <Image 
                src={previewImage.image === null ? userData.profile_picture || profilePic : previewImage.image}
                alt="preview profile" 
                width={358} 
                height={358} 
                className="rounded-2xl object-cover" 
              />

                <input 
                    type="file" 
                    id="file-upload" 
                    onChange={handleImageFileChange}
                    className='hidden'
                  />

                <label 
                  htmlFor="file-upload" 
                  onClick={clickToUpLoad}
                  className='px-8 py-[18px] bg-[#2F5FAC] hover:bg-blue-500 rounded-xl text-white font-bold cursor-pointer'>
                    {userData.profile_picture !== null ? 'Change photo' : 'Upload photo'}
                  </label>
                </div>):(
                  <div className='relative flex flex-col items-center justify-center gap-4'>
                    <Image src={previewImage.image === null ? userData.profile_picture || profilePic : previewImage.image}
                       alt='preview profile' 
                       width={358} 
                       height={358} 
                       className='rounded-2xl'
                    />

                    <input 
                        type="file" 
                        id="file-upload" 
                        onChange={handleImageFileChange}
                        className='hidden'
                      />

                    <label 
                      htmlFor="file-upload" 
                      onClick={clickToUpLoad}
                      className='px-8 py-[18px] bg-[#2F5FAC] rounded-xl text-white font-bold cursor-pointer'>
                        {userData.profile_picture !== null ? 'Change photo' : 'Upload photo'}
                    </label>

                    {previewImage.image !== null && (
                      <div 
                        onClick={deletePreviewImage}
                        className='absolute top-[-5px] right-[-5px] w-[20px] h-[20px] 
                        rounded-full flex items-center justify-center bg-[#9B2FAC] text-white font-bold cursor-pointer 
                        text-[12px] leading-[20px]'>
                            x
                      </div>
                    )}

                  </div>
                )}

                {userData.profile_picture !== null && (
                  <button 
                    onClick={removeProfile}
                    className="text-[#2F5FAC] font-bold hover:text-blue-500">
                      Remove photo
                  </button> 
                )}
          </div>

          <div>
            <form 
              onSubmit={handleUpdateProfile}
              className='flex flex-col gap-6 lg:gap-10'>
              <div className='flex flex-col gap-1'>
                <label>Name</label>
                
                <input 
                  type='text' 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className='w-[343px] lg:w-[453px] border border-[#D6D9E4] rounded-lg py-2 px-4 outline-none'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label>Date of Birth</label>

                <input 
                  type='date' 
                  value={date_of_birth} 
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className='w-[343px] lg:w-[453px] border border-[#D6D9E4] rounded-lg py-2 px-4 outline-none'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label>Educational Background</label>

                <input 
                  type='text' 
                  value={education_background} 
                  onChange={(e) => setEducationBackground(e.target.value)}
                  className='w-[343px] lg:w-[453px] border border-[#D6D9E4] rounded-lg py-2 px-4 outline-none'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label>Email</label>

                <input 
                  type='email' 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-[343px] lg:w-[453px] border border-[#D6D9E4] rounded-lg py-2 px-4 outline-none'
                />
              </div>

              <button 
                type='submit'
                className='px-8 py-[18px] bg-[#2F5FAC] hover:bg-blue-500 rounded-xl text-white font-bold'>
                  Update Profile
                </button>
            </form>
          </div>
        </div>

        <div className='absolute top-10 lg:top-[100px] left-5 lg:left-[102px] w-2 h-2 border-3 border-[#2F5FAC] rounded-full'></div>

        <div className='absolute top-[67px] lg:top-[159px] left-[-16px] lg:left-[43px] w-7 h-7 rounded-full bg-[#C6DCFF]'></div>

        <div className='absolute z-[-1] top-[211px] lg:top-[216px] right-[-21px] lg:right-[-28px] w-[74px] h-[74px] rounded-full bg-[#C6DCFF]'></div>

        <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute top-[53px] lg:top-[126px] right-[-18px] lg:right-28'>
          <path d="M11.3581 19.9099L37.1499 15.9774L27.6597 40.28L11.3581 19.9099Z" stroke="#FBAA1C" strokeWidth="3"/>
        </svg>

        {loading && <div className="absolute inset-0 flex items-center justify-center min-h-screen">
                    <Loading/>
                </div>}

      </div>
      <Footer/>
    </div>
  );
}
