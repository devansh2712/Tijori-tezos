import React, {useState} from "react";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { Tezos } from '@taquito/taquito';
import { ThanosWallet } from '@thanos-wallet/dapp';



const AddDAO = (props) => {

    

        const sendProposal = async () => {
            try {
              const available = await ThanosWallet.isAvailable();
              if (!available) {
                throw new Error('Thanos Wallet not installed');
              }
            } catch (err) {
              console.log(err);
            }
            const wallet = new ThanosWallet('Tijori');
            await wallet.connect("carthagenet");
            
            const tezos = wallet.toTezos();
            const accountPkh = await tezos.wallet.pkh();
            const accountBalance = await tezos.tz.getBalance(accountPkh);
            const DaoContract = await tezos.wallet.at(
              "KT1Wv17QNADUyQRbiVrp5TquHKFvoEyG7wV8"
            );
            const operation = await DaoContract.methods.addDAO("1601835054000",100,100,10,"1601827854000","1601824254000").send({amount: 0.0001});
            
            await operation.confirmation();
            
            const addmemberValue = await DaoContract.storage();
            console.info(`Member: ${addmemberValue}`);
        }
    
    
    
//State for amount in proposal
const[value,setValue] = useState(0)

const handleChange = (event) => {
    setValue(event.target.value)
}
        return (
            <Form onSubmit={sendProposal}>
            <Form.Row className="align-items-center">
            <Col xs="auto">
                <Form.Label htmlFor="inlineFormInput" srOnly>
                Amount
                </Form.Label>
                <Form.Control
                className="mb-2"
                id="inlineFormInput"
                placeholder="Amount"
                value = {value}
                onChange = {(event)=>handleChange(event)}
                />
            </Col>
            <Col xs="auto">
                <Form.Label htmlFor="inlineFormInputGroup" srOnly>
                Market
                </Form.Label>
                <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>@</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl id="inlineFormInputGroup" placeholder="Market" />
                </InputGroup>
            </Col>
            
            <Col xs="auto">
                <Button type="submit" className="mb-2" onClick={sendProposal}>
                Submit
                </Button>
            </Col>
            </Form.Row>
        </Form>
        );
}

export default AddDAO;