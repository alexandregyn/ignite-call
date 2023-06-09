import { Avatar, Button, Heading, MultiStep, Text, TextArea, } from "@ignite-ui/react";
import { useForm } from "react-hook-form";
import { ArrowRight } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Container, Header } from "../styles";
import { FormAnnotation, ProfileBox } from "./styles";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { buidNextAuthOptions } from "../../api/auth/[...nextauth].api";
import { getServerSession } from "next-auth";
import { api } from "../../../lib/axios";
import { useRouter } from "next/router";

const updateProfileFormSchema = z.object({
  bio: z.string(),
})

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;

export default function UpdateProfile() {
  const { 
    register, 
    handleSubmit, 
    formState:{ isSubmitting }
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema)
  });

  const session = useSession();
  const router = useRouter();

  const handleUpdateProfile = async (data: UpdateProfileFormData) => {
    await api.put('/users/profile', { bio: data.bio });
    await router.push(`/schedule/${session.data?.user.username}`);
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>

        <Text>
          Por último, uma breve descrição e uma foto de perfil.
        </Text>

        <MultiStep size={4} currentStep={4}/>
      </Header>
      
      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Foto de perfil</Text>
          <Avatar src={session.data?.user.avatar_url} alt={session.data?.user.name}></Avatar>
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea
            {...register('bio')}
          />
          <FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, buidNextAuthOptions(req, res));
  
  return {
    props: {
      session
    },
  }
}
