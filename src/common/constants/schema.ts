import { AdminSchema } from 'src/admin/admin.schema';
import { ConseilsSchema, PathologieSchema, SpecialitySchema } from 'src/admin/model.schema';
import { ClientSchema, RendezVousSchema } from 'src/client/client.schema';
import { MedecinSchema } from 'src/medecin/medecin.schema';

export const allSchema = [
    { name: 'Admin', schema: AdminSchema },
      { name: 'Speciality', schema: SpecialitySchema },
      { name: 'Pathologie', schema: PathologieSchema },
      { name: 'Medecin', schema: MedecinSchema },
      { name: 'Client', schema: ClientSchema },
      { name: 'RendezVous', schema: RendezVousSchema },
      { name: 'Conseils', schema: ConseilsSchema },
]